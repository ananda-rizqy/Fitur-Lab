import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";

type Props = {
  titleCard: string;
  descriptionContent: string;
  children: React.ReactNode;
};

export function AuthLayout({ titleCard, descriptionContent, children }: Props) {
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <Card className="px-4 py-6 w-xl gap-6 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] ">
        <CardHeader className="flex items-center gap-6">
          <img
            src="../../../public/img/Logo-Polines.png"
            alt="logo-polines"
            className="w-16 "
          />
          <div>
            <CardTitle>
              <p className="font-black text-left text-lg">{titleCard}</p>
            </CardTitle>

            <CardDescription>
              <p className="text-left text-base font-normal">
                {descriptionContent}
              </p>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
