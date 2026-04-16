import { VendorMetrics as Metrics } from "@/lib/types";
import { Star, FlaskConical, Truck, Clock, Zap, ArrowUp } from "lucide-react";

export default function VendorMetrics({ metrics }: { metrics: Metrics }) {
  const items = [
    {
      icon: <Star className="h-4 w-4 text-amber-400" />,
      label: "Rating",
      value: `${metrics.overallRating.toFixed(1)} / 5`,
      sub: `${metrics.totalReviews} reviews`,
    },
    {
      icon: <FlaskConical className="h-4 w-4 text-blue-500" />,
      label: "Lab Testing",
      value: metrics.labTesting,
    },
    {
      icon: <Zap className="h-4 w-4 text-yellow-500" />,
      label: "Purity",
      value: metrics.purity,
    },
    {
      icon: <Truck className="h-4 w-4 text-purple-500" />,
      label: "Shipping",
      value: metrics.shipping,
    },
    {
      icon: <Clock className="h-4 w-4 text-green-500" />,
      label: "Response Time",
      value: metrics.responseTime,
    },
    ...(metrics.redditScore !== undefined
      ? [
          {
            icon: <ArrowUp className="h-4 w-4 text-orange-500" />,
            label: "Reddit Score",
            value: metrics.redditScore.toLocaleString(),
          },
        ]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-1"
        >
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            {item.icon}
            {item.label}
          </div>
          <p className="text-sm font-semibold text-gray-900">{item.value}</p>
          {item.sub && <p className="text-xs text-gray-400">{item.sub}</p>}
        </div>
      ))}
    </div>
  );
}
