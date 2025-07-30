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
    @php
        $now = now()->setTimezone('Asia/Tokyo');
        $limitedVisible = $limited->filter(function ($image) use ($now) {
            if (!empty($image->start_at) && $image->start_at > $now) {
                return false;
            }
            if (!empty($image->end_at) && $image->end_at < $now) {
                return false;
            }
            return (bool) $image->is_public;
        });
    @endphp
    @if ($limitedVisible->count())
        <h2 class="text-lg font-bold text-gray-700 mt-12 mb-4 text-center">限定メニュー</h2>
        <div class="grid grid-cols-3 items-stretch mt-6 gap-2">
            @foreach ($limitedVisible as $image)
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
    @php
        $normalVisible = $normal->filter(function ($menu) use ($now) {
            if (!empty($menu->start_at) && $menu->start_at > $now) {
                return false;
            }
            if (!empty($menu->end_at) && $menu->end_at < $now) {
                return false;
            }
            return (bool) $menu->is_public;
        });
    @endphp
    @if ($normalVisible->count())
        <h2 class="text-lg font-bold text-gray-700 mt-12 mb-4 text-center">通常メニュー</h2>
        <div class="grid grid-cols-3 items-stretch mt-6 gap-2">
            @foreach ($normalVisible as $menu)
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
    @php
        $sideVisible = $side->filter(function ($menu) use ($now) {
            if (!empty($menu->start_at) && $menu->start_at > $now) {
                return false;
            }
            if (!empty($menu->end_at) && $menu->end_at < $now) {
                return false;
            }
            return (bool) $menu->is_public;
        });
    @endphp
    @if ($sideVisible->count())
        <h2 class="text-lg font-bold text-gray-700 mt-12 mb-4 text-center">サイドメニュー</h2>
        <div class="grid grid-cols-3 items-stretch mt-6 gap-2">
            @foreach ($sideVisible as $menu)
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
