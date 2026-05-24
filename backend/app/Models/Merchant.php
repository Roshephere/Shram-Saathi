<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Merchant extends Model
{
    protected $fillable = ['user_id', 'business_name', 'phone', 'logo', 'pan_no', 'location', 'status', 'avg_rating', 'hourly_rate', 'extras', 'verified_at', 'verified_by'];

    protected $casts = [
        'extras' => 'array',
        'verified_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'merchant_skill');
    }
    public function category()
    {
        return $this->hasMany(MerchantCategory::class);
    }

    public function serviceCategories(){
        return $this->belongsToMany(ServiceCategory::class,'merchant_service_categories',
        'merchant_id',
        'service_category_id')->withPivot('base_rate',
        'experience_levels')->withTimestamps();
    }

    public function locations(){
        return $this->hasMany(MerchantLocation::class);
    }

    public function primaryLocation(){
        return $this->hasOne(MerchantLocation::class)->where('is_primary', true);
    }

    public function reviews(){
        return $this->hasMany(MerchantReview::class);
    }

    public function calculateAverageRating(){
        $reviews = $this->reviews()->where('is_verified', true)->get();

        if($reviews->isEmpty()){
            return null;
        }

    // checking if the review has already the overall rating, if not calculate it from the individual ratings
        $hasOverall = $reviews->first()->rating_overall !== null;
        if($hasOverall){
            return round($reviews->avg('rating_overall'), 2);
        }

        // Calculate overall rating from individual aspects
        $totalRating = 0;
        $ratingCount = 0;

        foreach($reviews as $review){
            if($review->rating_skill !== null){
                $totalRating += $review->rating_skill;
                $ratingCount++;
            }

            if($review->rating_timeliness !== null){
                $totalRating += $review->rating_timeliness;
                $ratingCount++;
            }

            if($review->rating_communication !== null){
                $totalRating += $review->rating_communication;
                $ratingCount++;
            }
        }

        if($ratingCount > 0){
            return round($totalRating / $ratingCount, 2);
        }

        return null; 
    }

    public function updateAverageRating(){
        $avgRating = $this->calculateAverageRating();
        $this->update(['avg_rating' => $avgRating]);
    }

    public function getReviewCount(){
        return $this->reviews()->where('is_verified', true)->count();
    }

    public function verifiedBy(){
        return $this->belongsTo(User::class, 'verified_by');
    }
}
