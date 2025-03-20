import React, { useState, useEffect, useRef, FunctionComponent, ReactNode, ReactElement } from 'react';
import PropTypes from 'prop-types';

interface AudioPlayerProps {
    src: string;
    play: boolean;
    volume: number;
    children: ReactNode,
    type?: string;
    key?: string;
    listenInterval?: number;
    onPause?: (e: Event) => void;
    onPlay?: (e: Event) => void;
    onError?: (e: Event) => void;
    onEnded?: (e: Event) => void;
    onListen?: (time: number) => void;
    onVolumeChanged?: (e: Event) => void;
    onTimeUpdate?: (e: Event) => void;
    onLoadedMetadata?: (e: Event) => void;
    onSeeked?: (e: Event) => void;
    className?: string;
}

const AudioPlayer: FunctionComponent<AudioPlayerProps> = (
    props
) => {

    const audioRef = useRef<HTMLAudioElement | null>(null);

    var listenTracker: number | null = null;


    useEffect(() => {
        audioRef.current = new Audio(props.src);
        const audio = audioRef.current;

        updateVolume(props.volume);

        audio.addEventListener('timeupdate', onTimeUpdate);
        // When audio play starts
        audio.addEventListener('play', onPlay);
        // When unloading the audio player (switching to another src)
        audio.addEventListener('error', onError);

        // When the file has finished playing to the end
        audio.addEventListener('ended', onEnded);

        // When the user pauses playback
        audio.addEventListener('pause', onPause);

        audio.addEventListener('volumechange', onVolumeChanged);
        // When the user drags the time indicator to a new time
        audio.addEventListener('seeked', onSeeked);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);

        if (props.play) audio.play();

        return () => {
            audio.pause();
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('error', onError);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('volumechange', onVolumeChanged);
            audio.removeEventListener('seeked', onSeeked);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        };
    }, [props.src, props.play]);


    const onSeeked = (e: Event) => {
        props.onSeeked?.(e);
    }
    const onTimeUpdate = (e: Event) => {
        props.onTimeUpdate?.(e);
    }

    const onPlay = (e: Event) => {
        setListenTrack();
        props.onPlay?.(e);
    }
    const onPause = (e: Event) => {
        clearListenTrack();
        props.onPause?.(e);
    }
    const onError = (e: Event) => props.onError?.(e);
    const onEnded = (e: Event) => {
        props.onEnded?.(e);
    }

    const onVolumeChanged = (e: Event) => {
        props.onVolumeChanged?.(e);
    }

    const onLoadedMetadata = (e: Event) => {
        props.onLoadedMetadata?.(e);
    }

    /**
   * Set the volume on the audio element from props
   * @param {Number} volume
   */
    const updateVolume = (volume: number) => {
        const audio = audioRef.current;
        if (audio !== null && typeof volume === 'number' && volume !== audio?.volume) {
            audio.volume = volume;
        }
    }

    /**
   * Set an interval to call props.onListen every props.listenInterval time period
   */
    function setListenTrack() {
        if (!listenTracker) {
            const listenInterval = props.listenInterval;
            listenTracker = window.setInterval(() => {
                audioRef.current && props.onListen?.(audioRef.current.currentTime);
            }, listenInterval);
        }
    }


    /**
     * Clear the onListen interval
     */
    function clearListenTrack() {
        if (listenTracker) {
            clearInterval(listenTracker);
        }
    }


    return (
        <>{props.children}</>

    );
};

export default AudioPlayer;

AudioPlayer.defaultProps = {
    className: '',
    onEnded: () => { },
    onError: () => { },
    onPause: () => { },
    onPlay: () => { },
    onVolumeChanged: () => { },
    onLoadedMetadata: () => { },
    onSeeked: () => { },
    volume: 1.0
};