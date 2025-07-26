@extends('layouts.app')

@section('title', $image->title)

@section('content')
    <div class="max-w-xl mx-auto bg-white rounded-3xl shadow p-6 mt-8">
        <div class="w-full aspect-square overflow-hidden mb-4">
            <img class="w-full h-full object-cover rounded-3xl" src="{{ asset('images/' . $image->file_path) }}"
                alt="{{ $image->alt_text ?? $image->title }}">
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2 text-center">{{ $image->title }}</h1>
        <div class="text-center text-lg text-gray-700 mb-4">
            @if ($image->price_s)
                <div>Sサイズ: <span class="font-semibold">¥{{ number_format($image->price_s) }}</span></div>
            @endif
            @if ($image->price_l)
                <div>Lサイズ: <span class="font-semibold">¥{{ number_format($image->price_l) }}</span></div>
            @endif
            @if ($image->price_other)
                <div>その他: <span class="font-semibold">¥{{ number_format($image->price_other) }}</span></div>
            @endif
        </div>
        @if ($image->caption)
            <div class="text-gray-600 whitespace-pre-line text-left">{{ $image->caption }}</div>
        @endif
    </div>
@endsection
