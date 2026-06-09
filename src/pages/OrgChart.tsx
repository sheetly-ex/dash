import React from 'react';
import OrgNode from '../components/org-chart/OrgNode';
import OrgBranch from '../components/org-chart/OrgBranch';
import { ORG_CHART_DATA } from '../constants/mockData';

const OrgChart: React.FC = () => {
  return (
    <div className="space-y-12 pb-20 pt-10 overflow-x-auto">
      <div className="min-w-250 flex flex-col items-center">
        <div className="flex justify-center relative">
          <OrgNode
            name={ORG_CHART_DATA.ceo.name}
            position={ORG_CHART_DATA.ceo.position}
            department={ORG_CHART_DATA.ceo.department}
            isTop
          />
        </div>
        <div className="w-px h-16 bg-slate-300"></div>
        <div className="relative w-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[66%] h-px bg-slate-300"></div>
          <div className="grid grid-cols-3 gap-8 pt-12">
            {ORG_CHART_DATA.branches.map((branch, idx) => (
              <OrgBranch
                key={idx}
                title={branch.title}
                head={branch.head}
                teams={branch.teams}
                isHighlighted={branch.isHighlighted}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgChart;
