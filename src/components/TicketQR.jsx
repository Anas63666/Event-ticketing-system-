import { QRCodeSVG } from 'qrcode.react';
import { Download, Calendar, MapPin, Clock, Ticket } from 'lucide-react';

const TicketQR = ({ ticket, event }) => {
  const downloadTicket = () => {
    const svg = document.getElementById(`qr-${ticket.id}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `ticket-${ticket.ticketId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="ticket-qr">
      <div className="ticket-header">
        <Ticket size={32} />
        <h3>Your Event Ticket</h3>
      </div>
      
      <div className="qr-container">
        <QRCodeSVG 
          id={`qr-${ticket.id}`}
          value={JSON.stringify({
            ticketId: ticket.ticketId,
            eventId: ticket.eventId,
            userId: ticket.userId,
            status: ticket.status
          })}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>
      
      <div className="ticket-info">
        <h4>{event.title}</h4>
        <div className="ticket-details">
          <div className="ticket-detail">
            <Calendar size={16} />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="ticket-detail">
            <Clock size={16} />
            <span>{event.time}</span>
          </div>
          <div className="ticket-detail">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
        </div>
        
        <div className="ticket-id">
          <strong>Ticket ID:</strong> {ticket.ticketId}
        </div>
        <div className="ticket-status">
          <strong>Status:</strong> 
          <span className={`status-${ticket.status}`}>{ticket.status.toUpperCase()}</span>
        </div>
      </div>
      
      <button onClick={downloadTicket} className="btn-download">
        <Download size={18} />
        Download Ticket
      </button>
    </div>
  );
};

export default TicketQR;
