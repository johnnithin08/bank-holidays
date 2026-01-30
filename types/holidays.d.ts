type GovUkEvent = {
  title: string;
  date: string;
  notes?: string;
  bunting?: boolean;
};

type GovUkDivision = {
  division: string;
  events: GovUkEvent[];
};

type GovUkFeed = {
  "england-and-wales": GovUkDivision;
  scotland: GovUkDivision;
  "northern-ireland": GovUkDivision;
};

type Holiday = {
  id: string;
  title: string;
  date: string;
};
