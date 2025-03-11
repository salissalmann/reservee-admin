import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { format } from 'date-fns'
import { Order } from '@/app/_types/qr-types'
import { useRouter } from 'next/navigation'
import { Download } from 'lucide-react'

const SeatMapTable = ({ filteredOrders, params }: { filteredOrders: Order[], params: any }) => {
  const router = useRouter()

  const TotalBookedTickets = filteredOrders.reduce((acc, order) => acc + (order.seatMapDetails?.length || 0), 0)
  const NumberOfScannedTickets = filteredOrders.reduce((acc, order) => acc + (order.qrCodes.filter((qrCode) => qrCode.is_scanned === true).length || 0), 0)

  const saveAs = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }

  const downloadCSV = () => {
    // Add CSV headers
    const headers = "Order ID,Email,Phone,Order Date,Area Name,Seat Number,Status\n"; 

    const csvContent = headers + filteredOrders.flatMap((order) =>  
      order.seatMapDetails?.map((seat) => `${order.id},${order.user_email},${order.user_phone},${format(new Date(order.created_at), "dd/MM/yyyy")},${seat.area_name},${seat.seat_number},${order.qrCodes.some((qrCode) => qrCode.seat_number === seat.seat_number && qrCode.area_id === seat.area_id && qrCode.is_scanned === true) ? "Scanned" : "Booked"}`)
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'tickets.csv');
  }


  return (<>

    <div className="mt-4 mb-4  bg-gray-200 dark:bg-tertiary border border-primary/10 dark:border-borderDark rounded-lg p-4 flex md:flex-row flex-col gap-4 justify-between items-start">
      <div className='flex flex-col gap-2'>
        <h1 className="text-3xl font-bold">Confirmed Tickets</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Here are the tickets that have been confirmed.</p>
        <div className='flex justify-start items-start'>
          <button className='bg-primary text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition-all duration-300 shadow-2xl'
            onClick={() => {
              router.push(`/ticket-scanning/${params.id}`)
            }}
          >
            Scan Tickets
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 md:min-w-[550px] min-w-full">
        <div className="flex flex-col gap-3 justify-start items-start bg-tertiary p-4 text-white rounded-lg border-2 border-primary">
          <div className="w-full">
            <div className="flex justify-between mb-1">
              <p className="text-sm font-medium">Total Tickets</p>
              <p className="text-sm font-bold">{TotalBookedTickets}</p>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between mb-1">
              <p className="text-sm font-medium">Scanned</p>
              <p className="text-sm font-bold">{NumberOfScannedTickets}</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(NumberOfScannedTickets / TotalBookedTickets) * 100}%` }}
              />
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between mb-1">
              <p className="text-sm font-medium">Unscanned</p>
              <p className="text-sm font-bold">{TotalBookedTickets - NumberOfScannedTickets}</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((TotalBookedTickets - NumberOfScannedTickets) / TotalBookedTickets) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

    </div>

    <div className="shadow-md rounded-lg overflow-hidden bg-gray-50 dark:bg-tertiary border border-primary/10 dark:border-borderDark">
      <Table>
        <TableHeader>
          <TableRow className="py-4 border-b border-primary/10 dark:border-borderDark">
            <TableHead className="py-4 font-extrabold">Order ID</TableHead>
            <TableHead className='py-4 font-extrabold'>Email</TableHead>
            <TableHead className='py-4 font-extrabold'>Phone</TableHead>
            <TableHead className="py-4 font-extrabold">Order Date</TableHead>
            <TableHead className="py-4 font-extrabold">Area Name</TableHead>
            <TableHead className="py-4 font-extrabold">Seat Number</TableHead>
            <TableHead className="py-4 font-extrabold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.flatMap((order) =>
            order.seatMapDetails?.map((seat: any, index: number) => {
              const isSeatScanned = order.qrCodes.some(
                (qrCode: any) => (qrCode.seat_number === seat.seat_number && qrCode.area_id === seat.area_id && qrCode.is_scanned === true)
              )
              return (
                <TableRow key={`${order.id}-${index}`} className="py-4 border-b border-primary/10 dark:border-borderDark">
                  <TableCell className="py-4">{order.id}</TableCell>
                  <TableCell className="py-4">{order.user_email || "N/A"}</TableCell>
                  <TableCell className="py-4">{order.user_phone || "N/A"}</TableCell>
                  <TableCell className="py-4">{format(new Date(order.created_at), "dd/MM/yyyy")}</TableCell>
                  <TableCell className="py-4">{seat.area_name}</TableCell>
                  <TableCell className="py-4">{seat.seat_number}</TableCell>
                  <TableCell className="py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${isSeatScanned ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {isSeatScanned ? "Scanned" : "Booked"}
                    </span>
                  </TableCell>
                </TableRow>
              )
            }),
          )}
        </TableBody>
      </Table>
      {filteredOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">No tickets found matching your criteria.</div>
      )}
    </div>


    <div className="flex justify-end items-end mt-4">
        <button className="flex justify-center items-center bg-primary text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition-all duration-300 shadow-2xl" onClick={downloadCSV}>
          <Download className="w-4 h-4 mr-2" />
          Download CSV
        </button>
      </div>
  </>
  )
}

export default SeatMapTable;