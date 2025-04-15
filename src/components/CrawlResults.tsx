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
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface CrawlResultsProps {
  data: any[];
  onSave?: (data: any) => void;
}

export const CrawlResults = ({ data, onSave }: CrawlResultsProps) => {
  const [filterText, setFilterText] = useState("");

  const filteredData = data.filter((item) => 
    JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <Card className="mt-6 p-4">
      <div className="mb-4">
        <Input
          placeholder="Filter results..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.url || 'N/A'}</TableCell>
                <TableCell>{item.content?.slice(0, 100) || 'N/A'}...</TableCell>
                <TableCell>{item.type || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
};