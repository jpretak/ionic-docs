import { Component, Listen, State, h } from '@stencil/core';
import PrismicDOM from 'prismic-dom';

import { trackClick, trackView } from './tracking-service';
import { getAd } from './ad-service';

@Component({
  tag: 'internal-ad',
  styleUrl: 'internal-ad.css'
})
export class InternalAd {
  @State() ad: any;

  constructor() {
    this.update();
  }

  // force an update on page change in case the component is reused
  @Listen('pageChanged', { target: 'body' })
  async update() {
    this.ad = await getAd();
    trackView(this.ad.ad_id);
  }

  render() {
    if (!this.ad || Object.keys(this.ad).length === 0) return;

    return (
      <a href={this.ad.ad_url.url}
         target={this.ad.ad_url.target}
         onClick={e => trackClick(this.ad.ad_id, e)}>
        <picture>
          <source media="(min-width: 37.5em)" src={this.ad.ad_image.url}/>
          <source src={this.ad.ad_image['1x'].url}/>
          <img src={this.ad.ad_image.url}
               alt={this.ad.ad_image.alt}
               height={this.ad.ad_image['1x'].dimensions.height}
               width={this.ad.ad_image['1x'].dimensions.width} />
          <p>{this.ad.ad_image.alt}</p>
        </picture>
        <div innerHTML={PrismicDOM.RichText.asHtml(this.ad.ad_copy)}></div>
      </a>
    );
  }
}
