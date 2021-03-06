import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { NgTubeStore, Video, nextVideo, previousVideo } from '../shared';

import { PlayState, RepeatState, SizeState } from '../reducers';
import { Quality } from '../quality.pipe';

declare var $: any;


@Component({
  moduleId: module.id,
  selector: 'navbar-footer',
  templateUrl: 'navbar-footer.component.html',
  styleUrls: ['navbar-footer.component.css'],
  pipes: [Quality]
})
export class NavbarFooterComponent implements OnInit, OnDestroy {

    play: PlayState;
    repeat: RepeatState;
    minimize: SizeState;
    currentQuality: string;
    cinemaMode: Observable<boolean>;
    mute: boolean;
    volume: number;
    currentVideo: Video;
    playlist: any[];
    
    disabled: boolean = true;
    subscriptions: any[] = [];
    
    qualities: string[] = [];
     
  
    constructor (private store: Store<NgTubeStore>) {
      
        this.subscriptions.push(
            
            store.select('currentVideo').subscribe((video: Video) => {
                
                this.currentVideo = video;
                
                this.disabled = (video === null);
            }),
            
            store.select('play').subscribe((play: PlayState) => {
                
                this.play = play;
            }),
            
            store.select('repeat').subscribe((repeat: RepeatState) => {
                
                this.repeat = repeat;
            }),
            
            store.select('minimize').subscribe((minimize: SizeState) => {
                
                this.minimize = minimize;
            }),
            
            store.select('playlist').subscribe((playlist: any[]) => {
                
                this.playlist = playlist;  
            }),
            
            store.select('currentQuality').subscribe((quality: string) => {
                this.currentQuality = quality;
            }),
            
            store.select('qualities').subscribe((qualities: string[]) => {
                this.qualities = qualities;
            }),

            store.select('mute').subscribe((x: boolean) => {
                this.mute = x;
            }),
            
            store.select('volume').subscribe((x: number) => {
                this.volume = x;  
            })
        );
        
        this.cinemaMode = this.store.select('cinemaMode');
    }

    ngOnInit () {
    }
    
    ngOnDestroy () {
        
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }
  
    onPrevious () {
        
        const previous = previousVideo(this.currentVideo, this.playlist);
        this.changeVideo(previous);
    }
    
    onNext () {
                
        const next = nextVideo(this.currentVideo, this.playlist);
        this.changeVideo(next);
    }
    
    private changeVideo (video: Video) {
        
        this.store.dispatch({ type: 'CLEAR_QUALITIES' });
        this.store.dispatch({ type: 'PLAY_VIDEO', payload: {
            video: video
        }});
    }
    
    onCinemaMode () {
        
        this.store.dispatch({ type: 'TOGGLE_CINEMA_MODE' });
    }
  
    onPlay () {

        if (this.play === PlayState.PLAY) {
            this.store.dispatch({ type: 'PAUSE' });
        }
        else {
            this.store.dispatch({ type: 'PLAY', });
        }
    }
    
    onStop () {
        this.store.dispatch({ type: 'STOP' });
        this.store.dispatch({ type: 'CLEAR_QUALITIES' });
    }
    
    onMute () {
        
        if (this.mute) {
            this.store.dispatch({ type: 'UNMUTE' });
        }
        else {
            this.store.dispatch({ type: 'MUTE' });
        }
    }
    
    setVolume (volume: string) {
        
        this.store.dispatch({ type: 'SET_VOLUME', payload: { volume: parseInt(volume) }});
    }
    
    
    onRepeat () {
        
        const action = 'SET_REPEAT';
        const payload: any = {};
        switch (this.repeat) {
            
            case RepeatState.NONE:
                payload.repeat = RepeatState.ALL;
                break;
            case RepeatState.ALL:
                payload.repeat = RepeatState.ONE;
                break;
            case RepeatState.ONE:
                payload.repeat = RepeatState.NONE;
                break;
        }
        
        this.store.dispatch({ type: action, payload: payload });
    }
    
    onQuality (quality: string) {
        this.store.dispatch({ type: 'SET_QUALITY', payload: { quality } });
    }
    
    onMinimize () {
        
        if (this.minimize === SizeState.MINIMIZE) {
            this.store.dispatch({ type: 'MAXIMIZE' });
        }
        else {
            this.store.dispatch({ type: 'MINIMIZE' });
        }
    }
        
    onPlaylist() {
        if (!this.isInPlaylist()) {
            this.store.dispatch({ type: 'ADD_TO_PLAYLIST', payload: { video: this.currentVideo } });
        }        
    }
    
    isInPlaylist() {
        return this.currentVideo 
            && this.playlist
                .filter(video => video.id === this.currentVideo.id)
                .length;
    }
    
    // Zero or one is not a "real" playlist
    isRealPlaylist() {
        
        return this.playlist && this.playlist.length > 1;
    }
    
    isMinimize () {
        
        return this.minimize === SizeState.MINIMIZE;
    }
    
    isPlay () {
        
        return this.play === PlayState.PLAY;
    }
    
    isStop () {
        
        return this.play === PlayState.STOP;
    }
    
    isRepeatNone () {
        
        return this.repeat === RepeatState.NONE;
    }
    
    isRepeatOne () {
        
        return this.repeat === RepeatState.ONE;
    }
    
    isRepeatAll () {
        
        return this.repeat === RepeatState.ALL;
    }

    sidebar () {
        $('.button-collapse').sideNav();
    }
}
