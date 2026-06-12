interface InventoryTemplateProps {
  header?: React.ReactNode;
  form?: React.ReactNode;
  table?: React.ReactNode;
  modal?: React.ReactNode;
  children?: React.ReactNode;
}

export const InventoryTemplate = ({
  header,
  form,
  table,
  modal,
  children,
}: InventoryTemplateProps) => (
  <div className="min-h-screen  p-4 md:p-8">
    <div className="max-w-7xl mx-auto space-y-8">
      {header}
      {form}
      {table}
      {modal}
      {children}
    </div>
  </div>
);
