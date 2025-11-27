using System;
using System.Windows.Forms;

class DemoForm : Form
{
    Button btnShowHide, btnEnableDisable, targetButton;

    public DemoForm()
    {
        // Target button
        targetButton = new Button();
        targetButton.Text = "Click Me";
        targetButton.Location = new System.Drawing.Point(50, 50);

        // Show/Hide toggle
        btnShowHide = new Button();
        btnShowHide.Text = "Show/Hide";
        btnShowHide.Location = new System.Drawing.Point(50, 100);
        btnShowHide.Click += (s, e) => targetButton.Visible = !targetButton.Visible;

        // Enable/Disable toggle
        btnEnableDisable = new Button();
        btnEnableDisable.Text = "Enable/Disable";
        btnEnableDisable.Location = new System.Drawing.Point(150, 100);
        btnEnableDisable.Click += (s, e) => targetButton.Enabled = !targetButton.Enabled;

        Controls.Add(targetButton);
        Controls.Add(btnShowHide);
        Controls.Add(btnEnableDisable);
    }

    [STAThread]
    static void Main()
    {
        Application.Run(new DemoForm());
    }
}
