import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";

const RemoveYearAlertDialog = ({
  onClick,
  visible,
  selectedProductsLength,
}: {
  onClick: () => void;
  visible: boolean;
  selectedProductsLength: number;
}) => {
  if (!visible) return null;
  if (selectedProductsLength === 0)
    // not showing alert dialog if there are no selected products yet
    return (
      <Button onClick={onClick} variant="destructive" className="w-full">
        <p>{"Remove"}</p>
      </Button>
    );
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <p>{"Remove"}</p>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{"Are you absolutely sure?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {
              "This action cannot be undone. This will permanently delete your selected services."
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{"Cancel"}</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>{"Remove"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveYearAlertDialog;
