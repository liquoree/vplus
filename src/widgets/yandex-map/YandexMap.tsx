'use client';

import Script from 'next/script';
import { useCallback, useRef, useState } from 'react';
import { cn } from '@/shared/lib/cn';
import type { LngLat } from '@/shared/config/company-location';

import './YandexMap.scss';

type YandexMapProps = {
    center: LngLat;
    markerCoordinates?: LngLat;
    zoom?: number;
    title?: string;
    className?: string;
};

type YMapInstance = {
    addChild: (child: unknown) => void;
    destroy: () => void;
};

type YMaps3 = {
    ready: Promise<void>;
    YMap: new (
        container: HTMLElement,
        options: {
            location: {
                center: LngLat;
                zoom: number;
            };
        },
    ) => YMapInstance;
    YMapDefaultSchemeLayer: new (options?: object) => unknown;
    YMapDefaultFeaturesLayer: new (options?: object) => unknown;
    YMapMarker: new (
        options: {
            coordinates: LngLat;
        },
        element: HTMLElement,
    ) => unknown;
};

declare global {
    interface Window {
        ymaps3?: YMaps3;
    }
}

export function YandexMap({
    center,
    markerCoordinates = center,
    zoom = 15,
    title = 'Местоположение',
    className,
}: YandexMapProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<YMapInstance | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

    const initMap = useCallback(() => {
        if (!window.ymaps3 || !containerRef.current) {
            setIsError(true);
            setIsLoading(false);
            return;
        }

        window.ymaps3.ready
            .then(() => {
                if (!window.ymaps3 || !containerRef.current || mapRef.current) {
                    return;
                }

                const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } =
                    window.ymaps3;

                const map = new YMap(containerRef.current, {
                    location: {
                        center,
                        zoom,
                    },
                });

                map.addChild(new YMapDefaultSchemeLayer());
                map.addChild(new YMapDefaultFeaturesLayer());

                const markerElement = document.createElement('div');

                markerElement.className = 'yandex-map__marker';
                markerElement.setAttribute('aria-label', title);
                markerElement.setAttribute('title', title);

                map.addChild(
                    new YMapMarker(
                        {
                            coordinates: markerCoordinates,
                        },
                        markerElement,
                    ),
                );

                mapRef.current = map;

                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);

                setIsError(true);
                setIsLoading(false);
            });
    }, [center, markerCoordinates, zoom, title]);

    if (!apiKey) {
        return (
            <div className={cn('yandex-map', className)}>
                <div className="yandex-map__state">Не указан NEXT_PUBLIC_YANDEX_MAPS_API_KEY</div>
            </div>
        );
    }

    return (
        <div className={cn('yandex-map', className)}>
            <Script
                src={`https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`}
                strategy="afterInteractive"
                onReady={initMap}
                onError={(error) => {
                    console.error(error);

                    setIsError(true);
                    setIsLoading(false);
                }}
            />

            <div className="yandex-map__container" ref={containerRef} />

            {isLoading && <div className="yandex-map__state">Загрузка карты...</div>}

            {isError && <div className="yandex-map__state">Не удалось загрузить карту</div>}
        </div>
    );
}
