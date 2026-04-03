<?php
namespace App\Services;

use App\Models\Faq;

class FaqService{

public function getAll(){
    return Faq::latest()->get();
}

public function getById(int $id){
    return Faq::findOrFail($id);
}

public function createFaq(array $data){
    return Faq::create($data)   ;
}

public function updateFaq(int $id, array $data){
    $faq= $this->getById($id);
    $faq = $faq->update($data);
    return $faq;
}

public function deleteFaq($id){
    $faq = $this->getById($id);
    $faq= $faq->delete();
    return true;
}
}