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
            $limitedChunks = $limited->chunk(3);
        @endphp
        <div class="grid grid-cols-3 items-stretch mt-6 gap-2">
            @foreach ($limitedChunks as $chunk)
                @if (!$loop->last)
                    @foreach ($chunk as $image)
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
                    @endforeach
                @endif
            @endforeach
        </div>
        @php
            $last = collect($limitedChunks[count($limitedChunks) - 1] ?? []);
        @endphp
        @if ($last->count() && $last->count() < 3)
            @php
                $count = $last->count();
                if ($count === 2) {
                    $isTwo = true;
                } else {
                    $isTwo = false;
                    $dummyLeft = intdiv(3 - $count, 2);
                    $dummyRight = 3 - $count - $dummyLeft;
                }
            @endphp
            @if ($isTwo)
                <div class="flex flex-col items-center gap-y-2 mt-6 w-full max-w-full overflow-x-hidden px-2 mx-auto">
                    @foreach ($last as $image)
                        <div
                            class="bg-white overflow-hidden rounded-3xl flex flex-col items-center w-full max-w-[176px] flex-1 basis-0 min-w-0">
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
                    @endforeach
                </div>
            @else
                <div class="grid grid-cols-3 items-stretch mt-6 gap-2 max-w-2xl mx-auto">
                    @for ($i = 0; $i < $dummyLeft; $i++)
                        <div class="aspect-square bg-transparent"></div>
                    @endfor
                    @foreach ($last as $image)
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
                    @endforeach
                    @for ($i = 0; $i < $dummyRight; $i++)
                        <div class="aspect-square bg-transparent"></div>
                    @endfor
                </div>
            @endif
        @endif
    @endif

    @php
        $normal = isset($images) ? $images->where('tag_name', '通常メニュー')->values() : collect();
    @endphp
    @if ($normal->count())
        <h2 class="text-lg font-bold text-gray-700 mt-12 mb-4 text-center">通常メニュー</h2>
        @php
            $normalChunks = $normal->chunk(3);
        @endphp
        <div class="grid grid-cols-3 items-stretch mt-6 gap-2">
            @foreach ($normalChunks as $chunk)
                @if (!$loop->last)
                    @foreach ($chunk as $menu)
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
                    @endforeach
                @endif
            @endforeach
        </div>
        @php
            $last = collect($normalChunks[count($normalChunks) - 1] ?? []);
        @endphp
        @if ($last->count() && $last->count() < 3)
            @php
                $count = $last->count();
                if ($count === 2) {
                    $isTwo = true;
                } else {
                    $isTwo = false;
                    $dummyLeft = intdiv(3 - $count, 2);
                    $dummyRight = 3 - $count - $dummyLeft;
                }
            @endphp
            @if ($isTwo)
                <div class="flex flex-col items-center gap-y-2 mt-6 w-full max-w-full overflow-x-hidden px-2 mx-auto">
                    @foreach ($last as $menu)
                        <div
                            class="bg-white overflow-hidden rounded-3xl flex flex-col items-center w-full max-w-[176px] flex-1 basis-0 min-w-0">
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
                    @endforeach
                </div>
            @else
                <div class="grid grid-cols-3 items-stretch mt-6 gap-2 max-w-2xl mx-auto">
                    @for ($i = 0; $i < $dummyLeft; $i++)
                        <div class="aspect-square bg-transparent"></div>
                    @endfor
                    @foreach ($last as $menu)
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
                    @endforeach
                    @for ($i = 0; $i < $dummyRight; $i++)
                        <div class="aspect-square bg-transparent"></div>
                    @endfor
                </div>
            @endif
        @endif
    @endif
@endsection
