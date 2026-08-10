export type RadioGroupProps = {
  name: string;
  items: [value: string, label: string][];
  currentValue: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export default function RadioGroup(
  { name, items, currentValue, onChange }: RadioGroupProps,
) {
  return (
    <div>
      {items.map((v) => {
        return (
          <div className="mx-2">
            <input
              type="radio"
              value={v[0]}
              onChange={onChange}
              checked={currentValue == v[0]}
              className="accent-primary"
              key={`${name}_${v[0]}`}
            />
            <span className="px-1">{v[1]}</span>
          </div>
        );
      })}
    </div>
  );
}
