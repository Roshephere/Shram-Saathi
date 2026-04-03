<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function success($data=null, string $message = 'Success', int $code =200, array $meta =[]):JsonResponse
    {
        return response()->json([
            'success'=> true,
            'message'=> $message,
            'data'=> $data,
            'meta'=> (object) $meta,
        ],$code);
    }

    public function error(string $message = "Something Went wrong", int $code = 400, $errors = null):JsonResponse
    {
        return response()->json([
            'success'=> false,
            'message'=> $message,
            'errors'=>$errors
        ],$code);
    }
}
