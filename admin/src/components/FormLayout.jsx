// src/components/FormLayout.jsx
// Building blocks for settings-style forms (styles in index.css):
//
//   <FormPanel>
//     <FormSection title="Mail server" description="Where email is sent from.">
//       …Form.Items…
//     </FormSection>
//     <FormActions>…buttons…</FormActions>
//   </FormPanel>
import { Switch, Typography } from "antd";

// The white panel that holds a form's sections and its save bar
export const FormPanel = ({ children, style }) => (
  <div className="form-panel" style={style}>
    {children}
  </div>
);

// A titled group of fields: heading and explanation on the left, fields on
// the right (stacked on small screens). `wide` lets the content use the full
// width, for tables.
export const FormSection = ({ title, description, wide = false, children }) => (
  <section className="form-section">
    <div className="form-section__intro">
      <Typography.Title level={5} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
      {description && (
        <Typography.Paragraph type="secondary" style={{ margin: "6px 0 0", fontSize: 13 }}>
          {description}
        </Typography.Paragraph>
      )}
    </div>
    <div className={`form-section__body ${wide ? "form-section__body--wide" : ""}`}>
      {children}
    </div>
  </section>
);

// Save bar: stays at the bottom of the screen while the form is longer than it
export const FormActions = ({ hint, children }) => (
  <div className="form-actions">
    <span className="form-actions__hint">{hint}</span>
    <div className="form-actions__buttons">{children}</div>
  </div>
);

// An on/off option shown as a row: what it does on the left, switch on the
// right. Use inside <Form.Item name="…" valuePropName="checked" noStyle>.
export const SwitchField = ({ checked, onChange, disabled, title, description, id }) => (
  <label className={`switch-field ${disabled ? "switch-field--disabled" : ""}`}>
    <span className="switch-field__text">
      <span className="switch-field__title">{title}</span>
      {description && <span className="switch-field__description">{description}</span>}
    </span>
    <Switch id={id} checked={checked} onChange={onChange} disabled={disabled} />
  </label>
);
