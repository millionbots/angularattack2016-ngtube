import { Component, Input, OnInit, HostListener, HostBinding } from '@angular/core';

@Component({
  selector: 'thumbnail',
  templateUrl: 'app/thumbnail/thumbnail.component.html',
  styleUrls: ['app/thumbnail/thumbnail.component.css']
})
export class ThumbnailComponent {
    @Input() title: string;
    @Input() url: string;

    hover: boolean = false;
    
    @HostListener('mouseenter') onMouseEnter() {
        this.hover = true;
    }
    
    @HostListener('mouseleave') onMouseLeave() {
        this.hover = false;
    }
    
    @HostListener('mouseClick') onMouseClick() {
        // TODO
    }
}