import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import api from "../../services/api";

export function ModalReview() {
  const [reviewData, setReviewData] = useState({
    review: "",
    rating: 1,
  });
  const [openModal, setOpenModal] = useState(false);

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("review", reviewData);

      setOpenModal(false);

      setReviewData({ review: "", rating: 1 });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button>Review</Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Review Form</DialogTitle>
            <DialogDescription>Drop your review</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel>Review</FieldLabel>
              <Input
                name="review"
                value={reviewData.review}
                onChange={handleForm}
                placeholder="review here"
              />

              <Box sx={{ "& > legend": { mt: 2 } }}>
                <FieldLabel>Give Rating</FieldLabel>
                <Rating
                  value={reviewData.rating}
                  onChange={(e, newValue) => {
                    setReviewData({
                      ...reviewData,
                      rating: newValue ?? 0,
                    });
                  }}
                />
              </Box>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit">Send</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
