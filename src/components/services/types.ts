export type Vendor = {
  id?: string;
  _id?: string;
  name?: string;
  businessName?: string;
  image?: string | null;
  subscriptionPlan?: string;
};

export type ServiceDetail = {
  id?: string;
  _id?: string;
  serviceName?: string;
  name?: string;
  category?: string;
  description?: string;
  price?: number | string;
  location?: string;
  image?: string | null;
  images?: string[];
  vendor?: Vendor | string | null;
  vendorId?: string;
};
