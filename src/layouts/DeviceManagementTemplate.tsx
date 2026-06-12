import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export function DeviceManagementTemplate({ header, table, pagination }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{header}</CardTitle>
      </CardHeader>
      <CardContent>{table}</CardContent>
      <CardFooter>{pagination}</CardFooter>
    </Card>
  );
}
