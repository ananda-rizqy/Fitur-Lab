import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { IconStar } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogContent,
} from "../../components/ui/dialog";
import api from "../../services/api";

export function CardReview() {
  const [reviews, setReview] = useState<any[]>([]);
  const [expandedId, setExpanded] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const res = await api.get("/review");
      setReview(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`review/${id}`);

      // update state tanpa reload
      setReview((prev) => prev.filter((item) => item.id !== id));
      alert("Data berhasil dihapus");
      location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const ReviewText = ({ text, id }: { text: string; id: number }) => {
    const limit = 100;
    const isLong = text.length > limit;
    const isExpanded = expandedId === id;
    const displayText = isExpanded ? text : text.slice(0, limit);

    return (
      <p className="text-sm">
        {displayText}
        {isLong && !isExpanded && "... "}

        {isLong && (
          <span
            onClick={() => setExpanded(isExpanded ? null : id)}
            className="text-blue-500 cursor-pointer ml-1"
          >
            {isExpanded ? "Show less" : "Read more"}
          </span>
        )}
      </p>
    );
  };

  return (
    <div className="flex gap-8 items-stretch">
      {reviews.map((data) => (
        <Card key={data.id} className="w-120 flex flex-col">
          <CardHeader>
            <div className="flex gap-4">
              <img
                src={data.user.avatar || "/public/img/profile.png"}
                alt="Profile"
                className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl"
              />
              <div>
                <CardTitle className="text-sm">{data.user.name}</CardTitle>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <IconStar
                      key={i}
                      size={16}
                      className={
                        i < data.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300 fill-gray-300 opacity-50"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ReviewText text={data.review} id={data.id} />
          </CardContent>

          <CardFooter className="mt-auto">
            <div className="w-full text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Delete</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete review from Lingga</DialogTitle>
                  </DialogHeader>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={() => handleDelete(data.id)}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
