import { Redirect, useLocalSearchParams } from 'expo-router';
import { GrowCategoryScreen } from '@/components/GrowCategoryScreen';
import { growCategoryBySlug, type GrowSlug } from '@/data/grow';

export default function GrowCategoryRoute(){const{category}=useLocalSearchParams<{category:string}>();const item=growCategoryBySlug[category as GrowSlug];if(!item)return <Redirect href="/grow"/>;return <GrowCategoryScreen category={item}/>}
