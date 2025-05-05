// src/components/dashboard/SummaryCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
// Import specific icons as needed
import { DollarSign, TrendingUp, TrendingDown, Landmark, AlertCircle } from 'lucide-react';

// Map icon names to actual components
const iconMap = {
    dollar: DollarSign,
    'arrow-up': TrendingUp,
    'arrow-down': TrendingDown,
    bank: Landmark,
    default: AlertCircle,
};

const SummaryCard = ({ title, value, icon = "default", isLoading, trend }) => {
    const IconComponent = iconMap[icon] || iconMap.default;
    const trendColor = trend === 'positive' ? 'text-green-600' : trend === 'negative' ? 'text-red-600' : 'text-gray-900';

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
                 <IconComponent className={`h-5 w-5 ${isLoading ? 'text-gray-400' : 'text-gray-500'}`} />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-8 w-3/4" />
                ) : (
                    <div className={`text-2xl font-bold ${trendColor}`}>{value}</div>
                )}
                 {/* Optional: Add a percentage change or other small text */}
                 {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
            </CardContent>
        </Card>
    );
};

export default SummaryCard;