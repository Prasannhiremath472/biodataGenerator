import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_ROOT = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api').replace(/\/api\/?$/, '');

function useApiHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_ROOT}/health`);
      return data as { success: boolean; status: string };
    },
    retry: false,
  });
}

export default function HomePage() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useApiHealth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-gray-900">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 dark:text-white sm:text-5xl"
      >
        {t('home.heading')}
      </motion.h1>
      <p className="mt-4 max-w-xl text-gray-600 dark:text-gray-300">{t('home.subheading')}</p>

      <div className="mt-6 rounded-md border px-4 py-2 text-sm">
        {isLoading && <span className="text-gray-500">Checking API connection...</span>}
        {isError && <span className="text-red-600">API unreachable</span>}
        {data?.success && <span className="text-green-600">API connected ({data.status})</span>}
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          to="/create-biodata"
          className="rounded-md bg-amber-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-600"
        >
          Create Biodata Now
        </Link>
        <Link
          to="/templates"
          className="rounded-md border border-gray-900 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-white"
        >
          Browse Templates
        </Link>
      </div>
    </main>
  );
}
