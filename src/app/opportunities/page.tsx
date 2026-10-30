import {Directory} from '@/components/directory';
import {loadOpportunities} from '@/lib/opportunities';
export default function Opportunities(){return <><h1 className="text-3xl md:text-4xl font-black">Opportunity directory</h1><p className="muted my-4 max-w-2xl">Search official-source listings. Always review the provider’s terms before applying; inclusion does not guarantee eligibility.</p><Directory items={loadOpportunities()}/></>}
