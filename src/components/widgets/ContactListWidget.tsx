
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Users, Plus, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ContactListWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

const ContactListWidget = ({ widget, isSelected, onClick, onUpdate }: ContactListWidgetProps) => {
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", email: "", phone: "", role: "" });
  
  const contacts: Contact[] = widget.settings?.contacts || [];

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const addContact = () => {
    if (newContact.name) {
      const contact: Contact = {
        id: Date.now().toString(),
        ...newContact
      };
      const updatedContacts = [...contacts, contact];
      onUpdate({ ...widget.settings, contacts: updatedContacts });
      setNewContact({ name: "", email: "", phone: "", role: "" });
      setShowAddContact(false);
    }
  };

  const removeContact = (contactId: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    onUpdate({ ...widget.settings, contacts: updatedContacts });
  };

  return (
    <div
      ref={setNodeRef}
      className={`widget absolute bg-white rounded-lg shadow-lg border-2 transition-all duration-200 ${
        isDragging ? 'dragging shadow-xl scale-105' : ''
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        ...style,
        left: `${widget.position.x}px`,
        top: `${widget.position.y}px`,
        width: widget.size?.width || "320px",
        height: widget.size?.height || "400px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3 border-b pb-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Contacts</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddContact(!showAddContact);
            }}
            className="ml-auto"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {showAddContact && (
          <div className="mb-3 p-2 bg-gray-50 rounded space-y-2">
            <Input
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            />
            <Input
              placeholder="Email"
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            />
            <Input
              placeholder="Phone"
              type="tel"
              value={newContact.phone}
              onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            />
            <Input
              placeholder="Role/Title"
              value={newContact.role}
              onChange={(e) => setNewContact(prev => ({ ...prev, role: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            />
            <Button size="sm" onClick={addContact} className="w-full">
              Add Contact
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {contacts.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No contacts added</p>
          ) : (
            contacts.map((contact) => (
              <div key={contact.id} className="flex items-start gap-2 p-2 bg-blue-50 rounded text-sm">
                <div className="flex-1">
                  <div className="font-medium">{contact.name}</div>
                  {contact.role && <div className="text-gray-600 text-xs">{contact.role}</div>}
                  {contact.email && (
                    <div className="text-gray-600 flex items-center gap-1 text-xs">
                      <Mail className="w-3 h-3" />
                      {contact.email}
                    </div>
                  )}
                  {contact.phone && (
                    <div className="text-gray-600 flex items-center gap-1 text-xs">
                      <Phone className="w-3 h-3" />
                      {contact.phone}
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeContact(contact.id);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactListWidget;
