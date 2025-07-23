@extends('layouts.app')

@section('title', '白熊堂')

@section('content')

    <div class="bg-gray-50 flex items-center justify-center min-h-[100px] mb-2 overflow-hidden rounded-md">
        <img class="w-full h-auto aspect-[16/9] object-cover block max-w-2xl mx-auto"
            src="{{ asset('storage/images/tenpo_gaikan.jpg') }}" alt="店舗外観">
    </div>

    @php
        $limited = isset($images) ? $images->where('tag_name', '限定メニュー')->values() : collect();
    @endphp
    @if ($limited->count())
        <h2 class="text-lg font-bold text-gray-700 mt-8 mb-4 text-center">限定メニュー</h2>
        @php
            $count = $limited->count();
            $mod = $count % 3;
            $dummy = $mod === 0 ? 0 : 3 - $mod;
            $dummyLeft = 0;
            $dummyRight = 0;
            if ($dummy > 0) {
                $dummyLeft = intdiv($dummy, 2);
                $dummyRight = $dummy - $dummyLeft;
            }
        @endphp
        <div class="grid grid-cols-3 items-stretch mt-6 gap-2">
            @foreach ($limited as $idx => $image)
                @if ($loop->last && $dummy > 0)
                    @for ($i = 0; $i < $dummyLeft; $i++)
                        <div class="aspect-square bg-transparent"></div>
                    @endfor
                @endif
                <div class="bg-white overflow-hidden rounded-3xl flex flex-col items-center">
                    <div class="w-full aspect-square overflow-hidden">
                        <img class="w-full h-full object-cover rounded-3xl"
                            src="{{ asset('storage/images/' . $image->file_path) }}"
                            alt="{{ $image->alt_text ?? $image->title }}">
                    </div>
                    <div
                        class="w-full text-center font-semibold mt-2 px-2 py-1 break-words text-[clamp(0.75rem,2vw,1rem)] text-gray-700">
                        {!! nl2br(e($image->title)) !!}
                    </div>
                </div>
                @if ($loop->last && $dummy > 0)
                    @for ($i = 0; $i < $dummyRight; $i++)
                        <div class="aspect-square bg-transparent"></div>
                    @endfor
                @endif
            @endforeach
        </div>
    @endif

    @php
        $normal = isset($images) ? $images->where('tag_name', '通常メニュー')->values() : collect();
    @endphp
    @if ($normal->count())
        <h2 class="text-lg font-bold text-gray-700 mt-12 mb-4 text-center">通常メニュー</h2>
        @php
            $count = $normal->count();
            $mod = $count % 3;
            $dummy = $mod === 0 ? 0 : 3 - $mod;
            $dummyLeft = 0;
            $dummyRight = 0;
            if ($dummy > 0) {
                $dummyLeft = intdiv($dummy, 2);
                $dummyRight = $dummy - $dummyLeft;
            }
        @endphp
        <div class="grid grid-cols-3 items-stretch mt-6 gap-2">
            @foreach ($normal as $idx => $menu)
                @if ($loop->last && $dummy > 0)
                    @for ($i = 0; $i < $dummyLeft; $i++)
                        <div class="aspect-square bg-transparent"></div>
                    @endfor
                @endif
                <div class="bg-white overflow-hidden rounded-3xl flex flex-col items-center">
                    <div class="w-full aspect-square overflow-hidden">
                        <img class="w-full h-full object-cover rounded-3xl"
                            src="{{ asset('storage/images/' . $menu->file_path) }}"
                            alt="{{ $menu->alt_text ?? $menu->title }}">
                    </div>
                    <div
                        class="w-full text-center font-semibold mt-2 px-2 py-1 break-words text-[clamp(0.75rem,2vw,1rem)] text-gray-700">
                        {!! nl2br(e($menu->title)) !!}
                    </div>
                </div>
                @if ($loop->last && $dummy > 0)
                    @for ($i = 0; $i < $dummyRight; $i++)
                        <div class="aspect-square bg-transparent"></div>
                    @endfor
                @endif
            @endforeach
        </div>
    @endif
@endsection
