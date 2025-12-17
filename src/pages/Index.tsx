import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { VideoSection } from '@/components/home/VideoSection';
import { Categories } from '@/components/home/Categories';
import { BrandDNA } from '@/components/home/BrandDNA';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Newsletter } from '@/components/home/Newsletter';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <VideoSection />
      <Categories />
      <BrandDNA />
      <FeaturedProducts />
      <WhyChooseUs />
      <Newsletter />
    </Layout>
  );
};

export default Index;
