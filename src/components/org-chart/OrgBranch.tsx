import React from 'react';
import OrgNode from './OrgNode';

interface Team {
  name: string;
  lead: string;
}

interface OrgBranchProps {
  title: string;
  head: string;
  teams: Team[];
  isHighlighted?: boolean;
}

const OrgBranch: React.FC<OrgBranchProps> = ({ title, head, teams, isHighlighted = false }) => {
  return (
    <div className="flex flex-col items-center gap-10 relative">
      <div className="absolute -top-12 left-1/2 w-px h-12 bg-slate-300"></div>
      <OrgNode name={head} position="본부장" department={title} isHighlighted={isHighlighted} />
      <div className="w-px h-10 bg-slate-200"></div>
      <div className="flex flex-col gap-4">
        {teams.map((t) => (
          <OrgNode key={t.name} name={t.lead} position="팀장" department={t.name} isSmall />
        ))}
      </div>
    </div>
  );
};

export default OrgBranch;
