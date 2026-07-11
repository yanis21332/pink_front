
import { redirect } from 'next/navigation';
import HomePage from '../components/HomePage';
import { AUTH_COOKIE_NAME } from '../lib/data';
import { isValidAuthToken } from '../lib/auth';

export default async function Page() {
   
  
  const isValid = await isValidAuthToken();
  if (!isValid) {
    redirect("/login");
  }
  return <HomePage />;
}