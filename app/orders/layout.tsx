export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1">
      {children}
    </main>
  );
}

export const metadata = {
  title: 'Orders | Lammy\'s Multi Services',
  description: 'View and manage your orders at Lammy\'s Multi Services',
};
