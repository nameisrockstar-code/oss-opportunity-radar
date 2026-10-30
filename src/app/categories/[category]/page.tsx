import {notFound} from 'next/navigation';
import {categories} from '@/lib/schema';
import {Directory} from '@/components/directory';
import {loadOpportunities} from '@/lib/opportunities';
export function generateStaticParams(){return categories.map(category=>({category}))}
export default async function CategoryPage({params}:{params:Promise<{category:string}>}){const {category}=await params;if(!categories.includes(category as typeof categories[number]))notFound();return <><h1 className="text-3xl font-black capitalize mb-4">{category.replaceAll('-',' ')}</h1><p className="muted mb-7">Browse evidence-backed opportunities in this category.</p><Directory category={category} items={loadOpportunities()}/></>}
