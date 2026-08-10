export type ConfigCardProps = {
  caption: string;
  children: React.ReactNode;
};

export default function ConfigCard({ caption, children }: ConfigCardProps) {
  return (
    <div className="shadow-md rounded-sm p-0 max-w-100 bg-white">
      <h3 className="w-full mt-2 px-2 border-b-1 border-b-silver border-l-3 border-l-primary">
        {caption}
      </h3>
      <div className="w-full pl-4 pt-1 pb-2">
        {children}
      </div>
    </div>
  );
}
