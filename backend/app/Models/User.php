<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'status',
        'google_id',
        'email_verified_at',
        'registration_step',
        'registration_status',
        'registration_completed_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'google_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'status' => 'boolean',
        ];
    }

    protected $appends = ['role'];

    public function getRoleAttribute()
    {
        return $this->getRoleNames()->first() ?? 'customer';
    }

    public function merchant()
    {
        return $this->hasOne(Merchant::class);
    }


    public function isRegistrationComplete(): bool
    {
        return $this->registration_status === 'complete';
    }

    public function getRegistrationStep(): int
    {
        return $this->registration_step;
    }

    public function locations()
    {
        return $this->hasMany(UserLocation::class);
    }

    public function primaryLocation()
    {
        return $this->hasOne(UserLocation::class)->where('is_primary', true)->where('is_active', true);
    }

    public function serviceRequests()
    {
        return $this->hasMany(ServiceRequest::class);
    }

}
