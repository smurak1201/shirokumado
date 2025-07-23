@extends('layouts.app')

@section('title', '白熊堂')

@section('content')
<div class="w-screen max-w-screen bg-gray-50 flex items-center justify-center min-h-[100px] mb-2 overflow-hidden">
    <img class="w-screen h-auto aspect-[16/9] object-cover block max-w-screen min-w-screen" src="{{ asset('storage/images/tenpo_gaikan.jpg') }}" alt="店舗外観">
</div>

@if(isset($images) && count($images))
<div class="flex flex-wrap gap-y-4 gap-x-3 justify-center mt-6">
    @foreach($images as $image)
    <div class="w-44 max-w-[90vw] bg-white rounded-xl shadow-md p-2.5 text-center flex flex-col items-center">
        <img
            class="w-full h-auto rounded-lg mb-2 object-cover shadow"
            src="{{ asset('storage/images/' . $image->file_path) }}"
            alt="{{ $image->alt_text ?? $image->title }}">
        @if(!empty($image->title))
        <div class="text-base font-bold mb-1 text-gray-800">{{ $image->title }}</div>
        @endif
        @if(!empty($image->caption))
        <div class="text-sm text-gray-600 mb-1">{{ $image->caption }}</div>
        @endif
    </div>
    @endforeach
</div>
@endif
@endsection
