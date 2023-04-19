import HomePage from "@/components/HomePage";
import Provider from "@/components/Provider";

export default async function Page() {
  return (
    <Provider>
      <HomePage />
    </Provider>
  );
}
