<?php

namespace App\Http\Controllers;

use App\Http\Requests\FaqRequest;
use App\Http\Resources\FaqResource;
use App\Models\Faq;
use App\Services\FaqService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FaqController extends Controller
{
    public function __construct(protected FaqService $faqService)
    {
    }

    public function index()
    {
        $faqs = $this->faqService->getAll();

        return $this->success(
            FaqResource::collection($faqs),
            $faqs->isEmpty() ? 'No FAQs found.' : 'FAQs obtained successfully.'
        );
    }

    public function show(Faq $faq)
    {
        return $this->success(
            new FaqResource($faq),
            'FAQ obtained successfully.'
        );
    }

    public function store(FaqRequest $request)
    {
        try {
            $faq = $this->faqService->createFaq($request->validated());

            return $this->success(
                new FaqResource($faq),
                'FAQ created successfully.'
            );
        } catch (Exception $e) {
            Log::error('Faq Store Error', ['error' => $e->getMessage()]);

            return $this->error('Failed to store the FAQ.');
        }
    }

    public function update(FaqRequest $request, Faq $faq)
    {
        try {
            $faq = $this->faqService->updateFaq(
                $faq->id,
                $request->validated()
            );

            return $this->success(
                new FaqResource($faq),
                'FAQ updated successfully.'
            );
        } catch (Exception $e) {
            Log::error('Faq Update Error', ['error' => $e->getMessage()]);

            return $this->error('Failed to update the FAQ.');
        }
    }

    public function destroy(Faq $faq)
    {
        $this->faqService->deleteFaq($faq->id);

        return $this->success(
            null,
            'FAQ deleted successfully.'
        );
    }
}

