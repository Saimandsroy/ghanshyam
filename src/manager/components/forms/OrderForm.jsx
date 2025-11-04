import React from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link, Image, AlignLeft, AlignCenter, AlignRight, Send } from 'lucide-react';
export const OrderForm = () => {
  return <div className="card p-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">Create New Order</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Order Type
          </label>
          <select className="input w-full">
            <option>Guest Post</option>
            <option>Link Insertion</option>
            <option>Content Creation</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Blogger
          </label>
          <select className="input w-full">
            <option>Select Blogger</option>
            <option>John Smith</option>
            <option>Sarah Johnson</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Root Domain
          </label>
          <input type="text" className="input w-full" placeholder="example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Due Date
          </label>
          <input type="date" className="input w-full" />
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Order Details
        </label>
        <div className="border border-border rounded-md overflow-hidden">
          <div className="bg-surface border-b border-border p-2 flex items-center gap-1 flex-wrap">
            <button className="p-1.5 rounded hover:bg-primary hover:bg-opacity-30">
              <Bold size={16} />
            </button>
            <button className="p-1.5 rounded hover:bg-primary hover:bg-opacity-30">
              <Italic size={16} />
            </button>
            <button className="p-1.5 rounded hover:bg-primary hover:bg-opacity-30">
              <Underline size={16} />
            </button>
            <span className="h-5 w-px bg-border mx-1"></span>
            <button className="p-1.5 rounded hover:bg-primary hover:bg-opacity-30">
              <List size={16} />
            </button>
            <button className="p-1.5 rounded hover:bg-primary hover:bg-opacity-30">
              <ListOrdered size={16} />
            </button>
            <span className="h-5 w-px bg-border mx-1"></span>
            <button className="p-1.5 rounded hover:bg-primary hover:bg-opacity-30">
              <Link size={16} />
            </button>
            <button className="p-1.5 rounded hover:bg-primary hover:bg-opacity-30">
              <Image size={16} />
            </button>
            <span className="h-5 w-px bg-border mx-1"></span>
            <button className="p-1.5 rounded hover:bg-primary hover:bg-opacity-30">
              <AlignLeft size={16} />
            </button>
            <button className="p-1.5 rounded hover:bg-primary hover:bg-opacity-30">
              <AlignCenter size={16} />
            </button>
            <button className="p-1.5 rounded hover:bg-primary hover:bg-opacity-30">
              <AlignRight size={16} />
            </button>
          </div>
          <textarea className="w-full bg-background p-3 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-accent resize-none" placeholder="Enter order details here..."></textarea>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="btn btn-accent">
          <Send size={16} className="mr-2" />
          Create Order
        </button>
      </div>
    </div>;
};