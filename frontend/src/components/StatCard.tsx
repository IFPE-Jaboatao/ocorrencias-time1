import { Card } from "flowbite-react";

export const StatCard = ({ title, value, icon: Icon }: any) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <h4 className="text-3xl font-bold text-gray-900">{value}</h4>
      </div>
      {Icon && <Icon className="text-3xl text-[#5da16f] opacity-20" />}
    </div>
  </Card>
);