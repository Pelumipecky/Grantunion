import React from 'react'

const IframeSect = () => {
  return (
    <section className="iframesect">
        <div className="iframeCntn">
          <iframe
            title="coinlib-market-widget"
            src="https://widget.coinlib.io/widget?type=full_v2&theme=dark&cnt=7&pref_coin_id=1505&graph=yes"
            width="100%"
            height="468"
            scrolling="no"
            loading="lazy"
            style={{ border: 0 }}
          ></iframe>
        </div>
    </section>
  )
}

export default IframeSect
