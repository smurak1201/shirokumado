@extends('layouts.app')

@section('title', '白熊堂')

@section('content')

    <div class="bg-gray-50 flex items-center justify-center min-h-[100px] mb-2 overflow-hidden rounded-md">
        <img class="w-full h-auto aspect-[16/9] object-cover block max-w-2xl mx-auto"
            src="{{ asset('storage/images/tenpo_gaikan.jpg') }}" alt="店舗外観">
    </div>

    @if (isset($images) && count($images))
        <h2 class="text-lg font-bold text-gray-700 mt-8 mb-4 text-center">限定メニュー</h2>
        @php
            $count = count($images);
            $mod = $count % 3;
            $dummy = $mod === 0 ? 0 : 3 - $mod;
            $dummyLeft = 0;
            $dummyRight = 0;
            if ($dummy > 0) {
                $dummyLeft = intdiv($dummy, 2);
                $dummyRight = $dummy - $dummyLeft;
            }
        @endphp
        <div class="grid grid-cols-3 place-items-center mt-6" style="gap: 2rem;">
            @php $rowCount = 0; @endphp
            @foreach ($images as $idx => $image)
                @if ($loop->last && $dummy > 0)
                    @for ($i = 0; $i < $dummyLeft; $i++)
                        <div class="aspect-square bg-transparent"></div>
                    @endfor
                @endif
                <div class="aspect-square bg-white overflow-hidden">
                    <img class="w-full h-full object-cover" src="{{ asset('storage/images/' . $image->file_path) }}"
                        alt="{{ $image->alt_text ?? $image->title }}">
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
