import { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol: string;
  interval: string;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ symbol, interval }) => {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!symbol || !interval) return;  

    // Clear existing widget if it exists.
    if (container.current) {
      container.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${symbol}",
        "interval": "${interval === "1 Hour" ? "60" : interval === "4 Hours" ? "240" : interval === "1 Day" ? "D" : "W"}",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }`;
    container.current?.appendChild(script);
  }, [symbol, interval]);

  return (
    <div
      className="tradingview-widget-container w-100vw h-100vh"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default memo(TradingViewWidget);
