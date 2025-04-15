import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface CrawlHistoryProps {
  history: Array<{
    url: string;
    timestamp: string;
    results: any[];
  }>;
  onViewResults: (results: any[]) => void;
}

export const CrawlHistory = ({ history, onViewResults }: CrawlHistoryProps) => {
  return (
    <Card className="mt-6 p-4">
      <h3 className="text-lg font-semibold mb-4">Crawl History</h3>
      <ScrollArea className="h-[200px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.url}</TableCell>
                <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewResults(item.results)}
                  >
                    View Results
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
};