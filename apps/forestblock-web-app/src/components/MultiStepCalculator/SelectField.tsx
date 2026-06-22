const SelectField: React.FC<{
  label: string;
  name: string;
  value: string;
  options: string[];
  labelsMapping?: Record<string, string>;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}> = ({ label, name, value, options, labelsMapping, onChange }) => (
  <div>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="border p-2 w-full rounded-full text-customGray"
    >
      <option value="" disabled>
        {label}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {labelsMapping ? labelsMapping[option] || option : option}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;
