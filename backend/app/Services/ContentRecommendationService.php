<?php

namespace App\Services;

use App\Models\Merchant;
use App\Models\ServiceRequest;
use Phpml\FeatureExtraction\TfIdfTransformer;
use Phpml\FeatureExtraction\TokenCountVectorizer;
use Phpml\Tokenization\WhitespaceTokenizer;

class ContentRecommendationService
{
    private array $corpus = [];
    private array $merchantIds = [];
    private ?TfIdfTransformer $tfidf = null;
    private ?TokenCountVectorizer $vectorizer = null;
    private array $tfidfMatrix = [];

    /**
     * Build the text corpus from all active merchants.
     * Each merchant's text = business_name + description + skill names + category names
     */
    public function buildCorpus(): void
    {
        $merchants = Merchant::with(['skills', 'serviceCategories'])
            ->where('status', 'active')
            ->get();

        $this->corpus = [];
        $this->merchantIds = [];

        foreach ($merchants as $merchant) {
            $parts = [];

            if ($merchant->business_name) $parts[] = $merchant->business_name;
            if ($merchant->description) $parts[] = $merchant->description;

            foreach ($merchant->skills as $skill) {
                $parts[] = $skill->name;
                if ($skill->description) $parts[] = $skill->description;
            }

            foreach ($merchant->serviceCategories as $cat) {
                $parts[] = $cat->name;
            }

            $text = mb_strtolower(implode(' ', $parts));
            $text = preg_replace('/[^\w\s]/', '', $text);
            $text = trim($text);

            if ($text === '') continue;

            $this->corpus[] = $text;
            $this->merchantIds[] = $merchant->id;
        }

        if (empty($this->corpus)) return;

        $this->vectorizer = new TokenCountVectorizer(new WhitespaceTokenizer());
        $samples = $this->corpus;
        $this->vectorizer->fit($samples);
        $this->vectorizer->transform($samples);

        $this->tfidf = new TfIdfTransformer();
        $this->tfidf->fit($samples);
        $this->tfidf->transform($samples);
        $this->tfidfMatrix = $samples;
    }

    /**
     * Vectorize a query string using the fitted vectorizer + tfidf
     */
    private function vectorizeQuery(string $query): array
    {
        $query = mb_strtolower($query);
        $query = preg_replace('/[^\w\s]/', '', $query);

        if (!$this->vectorizer || !$this->tfidf) {
            return [];
        }

        $querySample = $this->vectorizer->getVocabulary()
            ? [$query]
            : [];

        if (empty($querySample)) return [];

        $this->vectorizer->transform($querySample);
        $this->tfidf->transform($querySample);
        return $querySample[0] ?? [];
    }

    /**
     * Compute cosine similarity between two vectors
     */
    private function cosineSimilarity(array $a, array $b): float
    {
        $dotProduct = 0;
        $normA = 0;
        $normB = 0;

        foreach ($a as $i => $val) {
            $dotProduct += $val * ($b[$i] ?? 0);
            $normA += $val * $val;
        }
        foreach ($b as $val) {
            $normB += $val * $val;
        }

        $denom = sqrt($normA) * sqrt($normB);
        return $denom === 0.0 ? 0.0 : $dotProduct / $denom;
    }

    /**
     * Get content-based recommendations for a service request
     * Returns array of [merchant_id, score] sorted by relevance
     */
    public function getRecommendations(ServiceRequest $serviceRequest, int $limit = 10): array
    {
        $this->buildCorpus();

        if (empty($this->corpus)) return [];

        $queryParts = [];
        if ($serviceRequest->title) $queryParts[] = $serviceRequest->title;
        if ($serviceRequest->description) $queryParts[] = $serviceRequest->description;
        if ($serviceRequest->category) $queryParts[] = $serviceRequest->category->name;

        $queryText = implode(' ', $queryParts);
        if (empty(trim($queryText))) return [];

        $queryVec = $this->vectorizeQuery($queryText);

        if (empty($queryVec) || empty($this->tfidfMatrix)) return [];

        $results = [];
        foreach ($this->tfidfMatrix as $i => $docVec) {
            $score = $this->cosineSimilarity($queryVec, $docVec);
            if ($score > 0) {
                $results[] = [
                    'merchant_id' => $this->merchantIds[$i],
                    'content_score' => round($score, 4),
                ];
            }
        }

        usort($results, fn($a, $b) => $b['content_score'] <=> $a['content_score']);

        return array_slice($results, 0, $limit);
    }
}
