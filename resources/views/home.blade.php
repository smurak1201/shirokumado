@extends('layouts.app')

@section('title', '白熊堂')

@section('content')

    <div class="bg-gray-50 flex items-center justify-center min-h-[100px] mb-2 overflow-hidden rounded-md">
        <img class="w-full h-auto aspect-[16/9] object-cover block max-w-2xl mx-auto"
            src="{{ asset('images/tenpo_gaikan.jpg') }}" alt="店舗外観">
    </div>

    @php
        $limited = isset($images)
            ? $images
                ->where('tag_name', '限定メニュー')
                ->sortBy(function ($item) {
                    return [is_null($item->display_order) ? 1 : 0, $item->display_order ?? PHP_INT_MAX, $item->id];
                })
                ->values()
            : collect();
    @endphp
    @if ($limited->count())
        <h2 class="text-lg font-bold text-gray-700 mt-12 mb-4 text-center">限定メニュー</h2>
        <div class="grid grid-cols-3 items-stretch mt-6 gap-2">
            @foreach ($limited as $image)
                <div class="bg-white overflow-hidden rounded-3xl flex flex-col items-center">
                    <a href="{{ route('images.show', $image->id) }}" class="w-full">
                        <div class="w-full aspect-square overflow-hidden">
                            <img class="w-full h-full object-cover rounded-3xl transition-transform duration-200 hover:scale-105"
                                src="{{ asset('images/' . $image->file_path) }}"
                                alt="{{ $image->alt_text ?? $image->title }}" loading="lazy">
                        </div>
                        <div
                            class="w-full text-center font-semibold mt-2 px-2 py-1 break-words text-[clamp(0.75rem,2vw,1rem)] text-gray-700">
                            {!! nl2br(e($image->title)) !!}
                        </div>
                    </a>
                </div>
            @endforeach
        </div>
    @endif

    @php
        $normal = isset($images)
            ? $images
                ->where('tag_name', '通常メニュー')
                ->sortBy(function ($item) {
                    return [is_null($item->display_order) ? 1 : 0, $item->display_order ?? PHP_INT_MAX, $item->id];
                })
                ->values()
            : collect();
    @endphp
    @if ($normal->count())
        <h2 class="text-lg font-bold text-gray-700 mt-12 mb-4 text-center">通常メニュー</h2>
        <div class="grid grid-cols-3 items-stretch mt-6 gap-2">
            @foreach ($normal as $menu)
                <div class="bg-white overflow-hidden rounded-3xl flex flex-col items-center">
                    <a href="{{ route('images.show', $menu->id) }}" class="w-full">
                        <div class="w-full aspect-square overflow-hidden">
                            <img class="w-full h-full object-cover rounded-3xl transition-transform duration-200 hover:scale-105"
                                src="{{ asset('images/' . $menu->file_path) }}" alt="{{ $menu->alt_text ?? $menu->title }}"
                                loading="lazy">
                        </div>
                        <div
                            class="w-full text-center font-semibold mt-2 px-2 py-1 break-words text-[clamp(0.75rem,2vw,1rem)] text-gray-700">
                            {!! nl2br(e($menu->title)) !!}
                        </div>
                    </a>
                </div>
            @endforeach
        </div>
    @endif

    @php
        $side = isset($images)
            ? $images
                ->where('category_name', 'サイドメニュー')
                ->sortBy(function ($item) {
                    return [is_null($item->display_order) ? 1 : 0, $item->display_order ?? PHP_INT_MAX, $item->id];
                })
                ->values()
            : collect();
    @endphp
    @if ($side->count())
        <h2 class="text-lg font-bold text-gray-700 mt-12 mb-4 text-center">サイドメニュー</h2>
        <div class="grid grid-cols-3 items-stretch mt-6 gap-2">
            @foreach ($side as $menu)
                <div class="bg-white overflow-hidden rounded-3xl flex flex-col items-center">
                    <a href="{{ route('images.show', $menu->id) }}" class="w-full">
                        <div class="w-full aspect-square overflow-hidden">
                            <img class="w-full h-full object-cover rounded-3xl transition-transform duration-200 hover:scale-105"
                                src="{{ asset('images/' . $menu->file_path) }}" alt="{{ $menu->alt_text ?? $menu->title }}"
                                loading="lazy">
                        </div>
                        <div
                            class="w-full text-center font-semibold mt-2 px-2 py-1 break-words text-[clamp(0.75rem,2vw,1rem)] text-gray-700">
                            {!! nl2br(e($menu->title)) !!}
                        </div>
                    </a>
                </div>
            @endforeach
        </div>
    @endif

@endsection
