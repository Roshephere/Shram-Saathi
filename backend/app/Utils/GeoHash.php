<?php

namespace App\Utils;

class GeoHash
{
    private static string $alphabet = '0123456789bcdefghjkmnpqrstuvwxyz';
    private static array $bits = [16, 8, 4, 2, 1];

    /**
     * Encode latitude/longitude to geohash string
     *
     * Precision levels (for Nepal at ~27°N):
     *   4 chars ≈ 39km × 20km  (broad area)
     *   5 chars ≈ 5km  × 5km   (city/district level)
     *   6 chars ≈ 1.2km × 0.6km (neighborhood level) ← recommended
     *   7 chars ≈ 153m × 153m   (street level)
     *   8 chars ≈ 38m × 19m     (building level)
     */
    public static function encode(float $latitude, float $longitude, int $precision = 6): string
    {
        $minLat = -90.0;
        $maxLat = 90.0;
        $minLon = -180.0;
        $maxLon = 180.0;
        $geohash = '';
        $isLon = true;
        $bit = 0;
        $ch = 0;

        while (strlen($geohash) < $precision) {
            if ($isLon) {
                $mid = ($minLon + $maxLon) / 2;
                if ($longitude >= $mid) {
                    $ch |= self::$bits[$bit];
                    $minLon = $mid;
                } else {
                    $maxLon = $mid;
                }
            } else {
                $mid = ($minLat + $maxLat) / 2;
                if ($latitude >= $mid) {
                    $ch |= self::$bits[$bit];
                    $minLat = $mid;
                } else {
                    $maxLat = $mid;
                }
            }

            $isLon = !$isLon;

            if ($bit < 4) {
                $bit++;
            } else {
                $geohash .= self::$alphabet[$ch];
                $bit = 0;
                $ch = 0;
            }
        }

        return $geohash;
    }

    /**
     * Decode geohash string to latitude/longitude bounding box
     * Returns [minLat, maxLat, minLon, maxLon]
     */
    public static function decode(string $geohash): array
    {
        $minLat = -90.0;
        $maxLat = 90.0;
        $minLon = -180.0;
        $maxLon = 180.0;
        $isLon = true;

        for ($i = 0; $i < strlen($geohash); $i++) {
            $c = $geohash[$i];
            $cd = strpos(self::$alphabet, $c);

            for ($j = 0; $j < 5; $j++) {
                $mask = self::$bits[$j];
                if ($isLon) {
                    $mid = ($minLon + $maxLon) / 2;
                    if ($cd & $mask) {
                        $minLon = $mid;
                    } else {
                        $maxLon = $mid;
                    }
                } else {
                    $mid = ($minLat + $maxLat) / 2;
                    if ($cd & $mask) {
                        $minLat = $mid;
                    } else {
                        $maxLat = $mid;
                    }
                }
                $isLon = !$isLon;
            }
        }

        return [
            'min_lat' => $minLat,
            'max_lat' => $maxLat,
            'min_lon' => $minLon,
            'max_lon' => $maxLon,
            'lat' => ($minLat + $maxLat) / 2,
            'lon' => ($minLon + $maxLon) / 2,
        ];
    }

    /**
     * Get geohash prefix for a given precision
     * Useful for "find nearby" queries
     *
     * @param float $latitude
     * @param float $longitude
     * @param float $radiusKm Approximate search radius in km
     * @return string Geohash prefix (shorter = larger area)
     */
    public static function getPrefixForRadius(float $latitude, float $longitude, float $radiusKm): string
    {
        // Approximate precision needed for given radius
        // At ~27°N (Nepal):
        //   precision 4: ~39km  → radius ~40km
        //   precision 5: ~5km   → radius ~5km
        //   precision 6: ~1.2km → radius ~1km
        $precisionMap = [
            40 => 4,
            10 => 4,
            5  => 5,
            2  => 5,
            1  => 6,
            0.5 => 6,
        ];

        $precision = 6; // Default to neighborhood level
        foreach ($precisionMap as $thresholdKm => $prec) {
            if ($radiusKm >= $thresholdKm) {
                $precision = $prec;
                break;
            }
        }

        return substr(self::encode($latitude, $longitude, $precision), 0, $precision);
    }

    /**
     * Calculate the geohash prefix length for a given radius
     * More precise than getPrefixForRadius — uses actual geohash cell dimensions
     */
    public static function precisionForRadius(float $radiusKm, float $latitude): int
    {
        // Geohash cell dimensions at different precisions for latitude ~27°N
        // These are approximate and based on Nepal's latitude
        $cellSizes = [
            1 => [5000, 5000],
            2 => [1250, 625],
            3 => [156, 156],
            4 => [39, 19.5],
            5 => [4.88, 4.88],
            6 => [0.61, 0.61],
            7 => [0.076, 0.076],
        ];

        // Find the smallest precision where the cell size is >= radius
        for ($p = 7; $p >= 1; $p--) {
            if ($cellSizes[$p][0] >= $radiusKm) {
                return $p;
            }
        }

        return 1;
    }
}