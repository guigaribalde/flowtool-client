import Hero from './_components/hero';
import Features from './_components/features';
import FeaturesBlocks from './_components/features-blocks';
import Testimonials from './_components/testimonials';
import Newsletter from './_components/newsletter';

export const metadata = {
	title: 'Home - Simple',
	description: 'Page description',
};

export default function Home() {
	return (
		<>
			<Hero />
			<Features />
			<FeaturesBlocks />
			<Testimonials />
			<Newsletter />
		</>
	);
}
